import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function CreateBallot() {
  const [optionInput, setOptionInput] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [duration, setDuration] = useState<number>(30);
  const [options, setOptions] = useState<string[]>([]);
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "BallotContract", // Имя контракта
  });

  const createBallot = async () => {
    if (question && options.length > 1 && duration > 0) {
      await writeContractAsync({
        functionName: "createBallot",
        args: [question, options, BigInt(duration)],
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };
  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Создать</h2>
      <input
        type="text"
        placeholder="Вопрос голосования"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Добавить вариант ответа"
          value={optionInput}
          onChange={e => setOptionInput(e.target.value)}
          className="flex-1 p-2 mr-2 text-white rounded-lg"
        />
        <button onClick={addOption} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Добавить вариант
        </button>
      </div>
      <ul className="mb-4">
        {options.map((opt, idx) => (
          <li key={idx} className="text-lg">
            {opt}
          </li>
        ))}
      </ul>
      <input
        type="number"
        placeholder="Длительность (в секундах)"
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      <button
        onClick={createBallot}
        disabled={isMining}
        className={`w-full py-2 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isMining ? "Создание..." : "Создать"}
      </button>
    </div>
  );
}
