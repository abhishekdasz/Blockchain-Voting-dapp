async function main() {
  const Voting = await ethers.getContractFactory("Voting");

  // Start deployment, returning a promise that resolves to a contract object
  const Voting_ = await Voting.deploy(300, '0x453dc82774067149850Cb51c4a2a72a476f9cd5B');
  console.log("Contract address:", Voting_.target);


}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });