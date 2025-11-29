const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SocialNFT", function () {
    let SocialNFT;
    let socialNFT;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        [owner, addr1, addr2] = await ethers.getSigners();
        SocialNFT = await ethers.getContractFactory("SocialNFT");
        socialNFT = await SocialNFT.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await socialNFT.owner()).to.equal(owner.address);
        });

        it("Should have the correct name and symbol", async function () {
            expect(await socialNFT.name()).to.equal("SocialNFT");
            expect(await socialNFT.symbol()).to.equal("SNFT");
        });
    });

    describe("Minting", function () {
        it("Should mint a new NFT and set token URI", async function () {
            const tokenURI = "ipfs://QmTest123";

            // Mint NFT to addr1
            await socialNFT.mintSocialNFT(addr1.address, tokenURI);

            // Check balance
            expect(await socialNFT.balanceOf(addr1.address)).to.equal(1);

            // Check owner of token ID 1
            expect(await socialNFT.ownerOf(1)).to.equal(addr1.address);

            // Check Token URI
            expect(await socialNFT.tokenURI(1)).to.equal(tokenURI);
        });

        it("Should increment token IDs correctly", async function () {
            await socialNFT.mintSocialNFT(addr1.address, "uri1");
            await socialNFT.mintSocialNFT(addr2.address, "uri2");

            expect(await socialNFT.ownerOf(1)).to.equal(addr1.address);
            expect(await socialNFT.ownerOf(2)).to.equal(addr2.address);
        });
    });
});
