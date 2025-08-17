import React, { useEffect, useRef, useState } from "react";
import ComeBack from "../ComeBack";
import FastTypingService from "../../../services/FastTypingService";
import { toast, ToastContainer } from "react-toastify";
import { Button, Input, StatisticBox } from "../../ui";
import LoadAnimate from "../../LoadAnimate";
import AuthService from "../../../services/AuthService";

type WordsProps = {
  words: WordsT;
  currentWordIndex: number;
};
const Words: React.FC<WordsProps> = ({ words, currentWordIndex }) => {
  return (
    <div className="w-full min-h-[300px] border-2 border-zinc-900 rounded-lg p-5 flex flex-wrap gap-5">
      {words.map((word, index) => (
        <div
          className="rounded-lg p-2 select-none"
          style={{
            backgroundColor: currentWordIndex == index ? "#2b7fff" : currentWordIndex >= index ? (word.correct ? "#00bba7" : "#ff2056") : "",
          }}
        >
          <LoadAnimate atype="expansion" duration={50 + index * 5}>
            {word.word}
          </LoadAnimate>
        </div>
      ))}
    </div>
  );
};

type TimerProps = {
  isStarted: boolean;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  finished: boolean;
  result: Result;
};
const Timer: React.FC<TimerProps> = ({ isStarted, setFinished, result, finished }) => {
  const [timer, setTimer] = useState<number>(60);
  useEffect(() => {
    let interval: number;
    if (isStarted && !finished) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer == 0) {
        toast.info("Süre bitti!");

        setFinished(true);

        (async () => {
          const data = await FastTypingService.saveStatistics(result);
          if (data.success) {
            toast.success(data.data);
          } else {
            toast.warn("Giriş yapmadığın için istatiktiklerin kaydedilmedi!");
          }
        })();
        return;
      }
    }
    return () => clearInterval(interval);
  });

  return (
    <LoadAnimate atype="right-to-left" duration={120}>
      <div className="text-2xl h-full leading-10 select-none text-sky-950">{timer == 60 ? "1:00" : "00:" + timer}</div>
    </LoadAnimate>
  );
};

type ResultsProps = {
  result: Result;
  isSavedStatistics: boolean;
};
const Results: React.FC<ResultsProps> = ({ result, isSavedStatistics }) => {
  return (
    <div className="w-full h-[700px] bg-[#111111] p-10 rounded-lg shadow-xl">
      <h3 className="w-full h-10 text-2xl text-sky-500 border-b border-sky-500">Sonuçlar</h3>

      <div className="w-full flex flex-wrap justify-center gap-5 mt-30">
        <StatisticBox
          title="Doğru Kelime Sayısı"
          statistic={result.correctWords}
          brackets={result.correctWords + result.wrongWords}
          color="emerald"
        />

        <StatisticBox title="Yanlış Kelime Sayısı" statistic={result.wrongWords} brackets={result.correctWords + result.wrongWords} color="rose" />

        <StatisticBox title="Dakika Başına Kelime" statistic={(result.correctWords + result.wrongWords) / 1} color="yellow" />

        <StatisticBox
          title="Kelime Doğruluğu"
          statistic={Math.floor((result.correctWords / (result.correctWords + result.wrongWords)) * 100) + "%"}
          color="violet"
        />
      </div>

      <Button onClick={() => window.location.reload()} bg="indigo" style={{ marginTop: "50px" }} disabled={isSavedStatistics != true}>
        Kapat
      </Button>
    </div>
  );
};

type WordT = { correct: boolean; word: string };
type WordsT = Array<WordT>;

type Result = { correctWords: number; wrongWords: number };

const FastTyping: React.FC = () => {
  const [words, setWords] = useState<WordsT>([] as WordsT);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [result, setResult] = useState<Result>({ correctWords: 0, wrongWords: 0 } as Result);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isSavedStatistics, setIsSavedStatistics] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const data = await FastTypingService.getWords();
      if (data.success) {
        setWords(
          data.data.map((word) => {
            return { correct: false, word } as WordT;
          })
        );
        setCurrentWordIndex(0);
      } else {
        toast.error(`[${data.error.error}] ${data.error.message}`);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await AuthService.isLoggedIn();
      if (data.success) {
        setIsLoggedIn(data.data);
      } else {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  // TODO: Bunu yap!
  const getWordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentWord = words[currentWordIndex];

    if (e.code == "Space") {
      if (inputRef.current?.value.trim() == currentWord.word.trim()) {
        setResult((prev) => ({ correctWords: prev.correctWords + 1, wrongWords: prev.wrongWords } as Result));
        words[currentWordIndex].correct = true;
        setWords(words);
      } else {
        setResult((prev) => ({ correctWords: prev.correctWords, wrongWords: prev.wrongWords + 1 }));
        words[currentWordIndex].correct = false;
        setWords(words);
      }
      setCurrentWordIndex(currentWordIndex + 1);
      if (inputRef.current) inputRef.current.value = "";

      if (currentWordIndex + 1 == words.length) {
        toast.info("Bitirdin!");

        setFinished(true);

        (async () => {
          const data = await FastTypingService.saveStatistics(result);
          if (data.success) {
            toast.success(data.data);
          } else {
            toast.warn("Giriş yapmadığın için istatiktiklerin kaydedilmedi!");
          }
          setIsSavedStatistics(true);
        })();
        return;
      }
    }
  };

  return (
    <div className="px-30 py-10">
      <div className="w-full h-full flex">
        <ComeBack />

        <div className="w-[65%] m-auto mt-20">
          {!finished && (
            <div className="w-full h-full">
              <Words words={words} currentWordIndex={currentWordIndex} />

              <div className="w-full mt-5 flex justify-center gap-5">
                <LoadAnimate atype="left-to-right" duration={120}>
                  <Button bg={"indigo"} style={{ width: "100px" }} disabled={isStarted} onClick={() => setIsStarted(true)}>
                    Başlat
                  </Button>
                </LoadAnimate>

                <LoadAnimate atype="bottom-to-top" duration={120}>
                  <Input
                    type="text"
                    placeholder={!isLoggedIn && !isStarted ? "Giriş yapmadığın için oyun verilerin kaydedilmez!" : "Kelime"}
                    ref={inputRef}
                    onKeyDown={getWordInput}
                    disabled={!isStarted}
                  />
                </LoadAnimate>

                <Timer isStarted={isStarted} setFinished={setFinished} result={result} finished={finished} />
              </div>
            </div>
          )}

          {finished && <Results result={result} isSavedStatistics={isSavedStatistics} />}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FastTyping;
