import EndBallot from "~~/components/EndBallot";
import HasVoted from "~~/components/HasVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function BallotList() {
  const { data: ballotCount } = useScaffoldReadContract({
    contractName: "BallotContract", // Имя контракта
    functionName: "getBallotCount", // Имя функции для получения количества голосований
  });

  const renderBallots = () => {
    if (!ballotCount) return <p>Загрузка...</p>; // Пока данные не загружены, показываем индикатор загрузки
    const ballots = [];
    for (let i: number = 0; i < ballotCount; i++) {
      ballots.push(<BallotItem key={i} ballotId={BigInt(i)} />); // Генерируем компоненты для каждого голосования
    }
    return ballots;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Список голосований</h2>
      {ballotCount && ballotCount > 0 ? renderBallots() : <p className="text-xl">Нет активных голосований</p>}
    </div>
  );
}

function BallotItem({ ballotId }: { ballotId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "BallotContract",
    functionName: "getBallotDetails",
    args: [BigInt(ballotId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "BallotContract",
  });

  if (!data) return <p>Загрузка...</p>;

  const [question, options, , isActive] = data;
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-black">{question}</h3>
      <ul className="mt-2 mb-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center">
            <span className="text-black">{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote",
                    args: [BigInt(ballotId), BigInt(idx)],
                  })
                }
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {isActive && <EndBallot ballotId={ballotId} />}
      {!isActive && <p className="text-red-500">Голосование завершено</p>}
      <HasVoted ballotId={ballotId} />
    </div>
  );
}
