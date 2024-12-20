// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Смарт-контракт для голосования
 * @dev Позволяет создавать голосования, голосовать и завершать голосования с подсчетом голосов, а также проверять проголосовал ли пользователь
 */
contract BallotContract {
    string public greeting = "Building Unstoppable Apps!!!";

    // Структура, описывающая голосование
    struct Ballot {
        string question; // Вопрос голосования
        string[] options; // Варианты ответа
        mapping(uint => uint) voteCounts; // Количество голосов для каждого варианта
        mapping(address => bool) hasVoted; // Отслеживание проголосовавших участников
        uint endTime; // Время завершения голосования
        bool isActive; // Статус активности голосования
        address creator; // Создатель голосования
    }

    // Список всех созданных голосований
    Ballot[] public ballots;

    /**
     * @dev Создает новое голосование.
     * @param _question Вопрос голосования.
     * @param _options Варианты ответа для голосования.
     * @param _duration Продолжительность голосования в секундах.
     */
    function createBallot(string memory _question, string[] memory _options, uint _duration) public {
        require(_options.length > 1, "There must be at least two possible answers");
        require(_duration > 0, "The duration must be greater than zero");

        Ballot storage newBallot = ballots.push();
        newBallot.question = _question;
        newBallot.options = _options;
        newBallot.endTime = block.timestamp + _duration;
        newBallot.isActive = true;
        newBallot.creator = msg.sender;
    }

    /**
     * @dev Голосует за определенный вариант в голосовании.
     * @param _ballotId ID голосования.
     * @param _optionIndex Индекс выбранного варианта.
     */
    function vote(uint _ballotId, uint _optionIndex) public {
        require(_ballotId < ballots.length, "Voting with such an ID does not exist");
        Ballot storage ballot = ballots[_ballotId];

        require(block.timestamp < ballot.endTime, "The voting is completed");
        require(ballot.isActive, "Voting is not active");
        require(!ballot.hasVoted[msg.sender], "You have already voted");
        require(_optionIndex < ballot.options.length, "Invalid option index");

        // Устанавливаем, что пользователь проголосовал
        ballot.hasVoted[msg.sender] = true;
        // Увеличиваем счетчик голосов для выбранного варианта
        ballot.voteCounts[_optionIndex]++;
    }

    /**
     * @dev Завершает голосование и деактивирует его.
     * @param _ballotId ID голосования.
     */
    function endBallot(uint _ballotId) public {
        require(_ballotId < ballots.length, "Voting with such an ID does not exist");
        Ballot storage ballot = ballots[_ballotId];

        require(block.timestamp >= ballot.endTime, "Voting is still active");
        require(ballot.isActive, "The voting has already been completed");
        require(msg.sender == ballot.creator, "Only the creator can complete the voting");

        // Деактивируем голосование
        ballot.isActive = false;
    }

    /**
     * @dev Получает результаты голосования.
     * @param _ballotId ID голосования.
     * @return options Массив вариантов ответа.
     * @return voteCounts Массив количества голосов для каждого варианта.
     */
    function getResults(uint _ballotId) public view returns (string[] memory options, uint[] memory voteCounts) {
        require(_ballotId < ballots.length, "Voting with such an ID does not exist");
        Ballot storage ballot = ballots[_ballotId];

        options = ballot.options;
        voteCounts = new uint[](ballot.options.length);

        for (uint i = 0; i < ballot.options.length; i++) {
            voteCounts[i] = ballot.voteCounts[i];
        }
    }

    /**
     * @dev Возвращает общее количество голосований.
     * @return Количество созданных голосований.
     */
    function getBallotCount() public view returns (uint) {
        return ballots.length;
    }

    /**
     * @dev Возвращает информацию о голосовании по его ID.
     * @param _ballotId ID голосования.
     * @return question Вопрос голосования.
     * @return options Массив вариантов ответа.
     * @return endTime Время завершения голосования.
     * @return isActive Статус активности голосования.
     * @return creator Адрес создателя голосования.
     */
    function getBallotDetails(uint _ballotId) public view returns (
        string memory question,
        string[] memory options,
        uint endTime,
        bool isActive,
        address creator
    ) {
        require(_ballotId < ballots.length, "Voting with such an ID does not exist");
        Ballot storage ballot = ballots[_ballotId];
        return (ballot.question, ballot.options, ballot.endTime, ballot.isActive, ballot.creator);
    }

    /**
     * @dev Проверяет, голосовал ли пользователь в данном голосовании.
     * @param _ballotId ID голосования.
     * @param _voter Адрес пользователя.
     * @return True, если пользователь уже голосовал, иначе False.
     */
    function hasUserVoted(uint _ballotId, address _voter) public view returns (bool) {
        require(_ballotId < ballots.length, "Voting with such an ID does not exist");
        Ballot storage ballot = ballots[_ballotId];
        return ballot.hasVoted[_voter];
    }
}
