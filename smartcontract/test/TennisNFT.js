//Mocha is the framework and Chai is the library
const { expect } = require("chai");
const { ethers } = require("hardhat");
var assert = require('assert');
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

//Mention the name of the contract here
describe("TennisNFT", function(){
     
    let TennisNFT;
    let hardhatTennisNFT;
    let admin;
    let player;
    let addresses;
    let whiteId;
    let bronzeId;
    let silverId;
    let goldId;
    
    //Hook
    beforeEach(async function(){

        [admin, player, player2, ...addresses] = await ethers.getSigners();
 
        //Create an instance of our contract
        TennisNFT = await ethers.getContractFactory("TennisNFT");

        //Deploy this instance
        hardhatTennisNFT = await TennisNFT.deploy();

        //Retrieving the tokenID from Contract
        whiteId = await hardhatTennisNFT.WHITE();
        bronzeId = await hardhatTennisNFT.BRONZE();
        silverId = await hardhatTennisNFT.SILVER();
        goldId = await hardhatTennisNFT.GOLD();
    });

    //Write your test cases within this sub test-suite
    //Test suite for testing deployment functionalities 
    describe("Deployment", function(){
        //Mention the test case here - Test Case 1
        it("Should set the right owner", async function(){
            expect(await hardhatTennisNFT.admin()).to.equal(admin.address);
        });
        

        //Test Case 2
        it("Should mint specified number of NFTs from each category and assign it to the owner", async function(){

            console.log("Signers Object: ", admin);

            //I have to pass the tokenId as second argument. Figuring out how to do it
            console.log("Admin Address is ", admin.address);
            
            //Checking the number of tokens the owner has, in each tokenId
            const adminWhiteBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, whiteId);
            console.log("Number of White NFTs with the Admin is ", adminWhiteBalance);
            const adminBronzeBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, bronzeId);
            console.log("Number of Bronze NFTs with the Admin is ", adminBronzeBalance);
            const adminSilverBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, silverId);
            console.log("Number of Silver NFTs with the Admin is ", adminSilverBalance);
            const adminGoldBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, goldId);
            console.log("Number of Gold NFTs with the Admin is ", adminGoldBalance);

            //Checking if the total tokens minted during deployment is correct and is assigned to the owner
            expect(await hardhatTennisNFT.whiteIdInitialCount()).to.equal(adminWhiteBalance);
            expect(await hardhatTennisNFT.bronzeIdInitialCount()).to.equal(adminBronzeBalance);
            expect(await hardhatTennisNFT.silverIdInitialCount()).to.equal(adminSilverBalance);
            expect(await hardhatTennisNFT.goldIdInitialCount()).to.equal(adminGoldBalance);
        });

       
    });

    //Test suite to check Transactions
    describe("Testing the Transactions", async function(){
         //Test Case - 3
         it("Should transfer NFTs from the admin to the players", async function(){
            
            //Transfer 1 white NFT from owner address to player
            await hardhatTennisNFT.transferNFT(admin.address, player.address, whiteId, 1)
            expect(await hardhatTennisNFT.checkBalanceOf(player.address, whiteId)).to.equal(1);

            //Transfer 1 bronze NFT from owner address to player
            await hardhatTennisNFT.transferNFT(admin.address, player.address, bronzeId, 1)
            expect(await hardhatTennisNFT.checkBalanceOf(player.address, bronzeId)).to.equal(1);

            //Transfer 1 silver NFT from owner address to player
            await hardhatTennisNFT.transferNFT(admin.address, player.address, silverId, 1)
            expect(await hardhatTennisNFT.checkBalanceOf(player.address, silverId)).to.equal(1);

            //Transfer 1 gold NFT from owner address to player
            await hardhatTennisNFT.transferNFT(admin.address, player.address, goldId, 1)
            expect(await hardhatTennisNFT.checkBalanceOf(player.address, goldId)).to.equal(1);
        });

        //Test Case - 4
        it("Should fail if sender does not have enough tokens", async function(){
            //Initially Admin has all tokens and Player has 0 tokens
            const initialPlayerBalance = await hardhatTennisNFT.checkBalanceOf(player.address, whiteId);
            const initialAdminBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, whiteId);
            assert(initialAdminBalance >= 1, 'Not enough Tokens');
            await hardhatTennisNFT.transferNFT(admin.address, player.address, whiteId, 1);
            expect (await hardhatTennisNFT.checkBalanceOf(player.address, whiteId)).to.equal(initialPlayerBalance + 1);
        });

        //Test Case - 5
        it("Should update balances after Transfer", async function(){
            const initialPlayerBalance = await hardhatTennisNFT.checkBalanceOf(player.address, whiteId);
            const initialPlayer2Balance = await hardhatTennisNFT.checkBalanceOf(player2.address, whiteId);
            const initialAdminBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, whiteId);
            await hardhatTennisNFT.transferNFT(admin.address, player.address, whiteId, 1);
            await hardhatTennisNFT.transferNFT(admin.address, player2.address, whiteId, 1);

            const finalAdminBalance = await hardhatTennisNFT.checkBalanceOf(admin.address, whiteId);
            expect(finalAdminBalance).to.equal(initialAdminBalance-2);
            const finalPlayerBalance = await hardhatTennisNFT.checkBalanceOf(player.address, whiteId);
            expect(finalPlayerBalance).to.equal(initialPlayerBalance+1);
            const finalPlayer2Balance = await hardhatTennisNFT.checkBalanceOf(player2.address, whiteId);
            expect(finalPlayer2Balance).to.equal(initialPlayer2Balance+1);
            
        });
    });

    
});