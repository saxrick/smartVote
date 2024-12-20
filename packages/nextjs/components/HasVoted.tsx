import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasVoted({ ballotId }: { ballotId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");
  const { data: hasVoted } = useScaffoldReadContract({
    contractName: "BallotContract",
    functionName: "hasVoted",
    args: [ballotId, userAddress],
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (hasVoted === undefined) return <p>Загрузка...</p>;

  return (
    <div className="p-4 bg-green-600 text-white rounded-lg shadow-md mt-4">
      {hasVoted ? (
        <p className="text-xl">Вы уже проголосовали</p>
      ) : (
        <p className="text-xl">Вы ещё не проголосовали</p>
      )}
    </div>
  );
}
