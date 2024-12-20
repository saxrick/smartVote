import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndBallot({ ballotId }: { ballotId: bigint }) {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "BallotContract",
  });

  const handleEndBallot = async () => {
    try {
      await writeContractAsync({
        functionName: "endBallot",
        args: [ballotId],
      });
      alert("Голосование завершено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при завершении голосования.");
    }
  };

  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-bold">Завершить</h3>
      <p>Вы уверены, что хотите завершить голосование?</p>
      <button
        onClick={handleEndBallot}
        disabled={isMining}
        className={`mt-4 px-6 py-2 rounded-lg ${isMining ? "bg-gray-500" : "bg-red-700 hover:bg-red-800"}`}
      >
        {isMining ? "Завершение..." : "Завершить"}
      </button>
    </div>
  );
}
