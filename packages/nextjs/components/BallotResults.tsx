import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function BallotResults() {
  const [ballotId, setBallotId] = useState<number>(0);
  const { data } = useScaffoldReadContract({
    contractName: "BallotContract",
    functionName: "getResults",
    args: [BigInt(ballotId)],
  });

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-red-500 text-black rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Результаты голосования</h3>
      <input
        type="number"
        placeholder="ID голосования"
        onChange={e => setBallotId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-2 mb-4 text-white rounded-lg"
      />
      {data && (
        <div className="p-6 bg-gradient-to-r from-yellow-400 to-purple-500 text-black rounded-lg shadow-lg">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg mb-2">
                {option}: {Number(data[1][idx])} голосов
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
