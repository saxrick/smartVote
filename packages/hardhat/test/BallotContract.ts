import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BallotContract } from "../typechain-types";

describe("ballotContract Contract", function () {
  let ballotContract: BallotContract;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  beforeEach(async () => {
    const votingContractFactory = await ethers.getContractFactory("BallotContract");
    ballotContract = await votingContractFactory.deploy();
    await ballotContract.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should create a ballot", async () => {
    const options = ["Option 1", "Option 2"];
    await ballotContract.createBallot("Test Question", options, 3600);

    const ballot = await ballotContract.getBallotDetails(0);
    expect(ballot.question).to.equal("Test Question");
    expect(ballot.options).to.deep.equal(options);
    expect(ballot.isActive).to.equal(true);
    expect(ballot.creator).to.equal(owner.address);
  });

  it("Should not create ballot with less than 2 options", async () => {
    await expect(ballotContract.createBallot("Test Question", ["Option 1"], 3600)).to.be.revertedWith(
      "There must be at least two possible answers",
    );
  });

  it("Should prevent duplicate ballotContract", async () => {
    await ballotContract.createBallot("Test Question", ["Option 1", "Option 2"], 3600);

    await ballotContract.connect(addr1).vote(0, 0);
    await expect(ballotContract.connect(addr1).vote(0, 0)).to.be.revertedWith("You have already voted");
  });

  it("Should allow a user to vote", async () => {
    await ballotContract.createBallot("Test Question", ["Option 1", "Option 2"], 3600);

    await ballotContract.connect(addr1).vote(0, 0);
    const hasVoted = await ballotContract.hasUserVoted(0, addr1.address);
    expect(hasVoted).to.equal(true);
  });

  it("Should allow only the creator to end the ballot", async () => {
    await ballotContract.createBallot("Test Question", ["Option 1", "Option 2"], 1);

    // Forward time to ensure ballot can be ended
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    await ballotContract.endBallot(0);
    const ballot = await ballotContract.getBallotDetails(0);
    expect(ballot.isActive).to.equal(false);
  });

  it("Should not allow ending the ballot prematurely", async () => {
    await ballotContract.createBallot("Test Question", ["Option 1", "Option 2"], 3600);
    await expect(ballotContract.endBallot(0)).to.be.revertedWith("Voting is still active");
  });

  it("Should return ballot results correctly", async () => {
    await ballotContract.createBallot("Test Question", ["Option 1", "Option 2"], 3600);
    await ballotContract.connect(addr1).vote(0, 0);
    await ballotContract.connect(addr2).vote(0, 1);

    // Forward time to ensure ballot can be ended
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await ballotContract.endBallot(0);

    const results = await ballotContract.getResults(0);
    expect(results.voteCounts[0]).to.equal(1n);
    expect(results.voteCounts[1]).to.equal(1n);
  });
});
