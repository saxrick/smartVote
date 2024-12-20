import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя
import { BallotContract } from "../typechain-types"; // Импорт типов сгенерированного контракта

const deployBallotContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Извлечение имени учетной записи для деплоя
  const { deployer } = await hre.getNamedAccounts();
  // Получение функции для развертывания контрактов
  const { deploy } = hre.deployments;

  // Развертывание контракта BallotContract
  await deploy("BallotContract", {
    from: deployer, // Учетная запись, которая развертывает контракт
    args: [], // Аргументы конструктора контракта (в данном случае отсутствуют)
    log: true, // Включение логирования процесса развертывания
    autoMine: true, // Автоматическое майнинг транзакции на локальной сети
  });

  // Получение экземпляра развернутого контракта
  const votingContract = await hre.ethers.getContract<BallotContract>("BallotContract", deployer);

  // Проверка успешного развертывания контракта через вызов метода greeting()
  console.log("👋 Initial greeting:", await votingContract.greeting());
};

// Экспорт функции для использования в командах Hardhat
export default deployBallotContract;

// Присвоение тега для удобного выбора скрипта при выполнении
deployBallotContract.tags = ["BallotContract"];
