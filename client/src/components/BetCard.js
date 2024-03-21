import React, { useState } from 'react';
import { useChains, useChainId } from 'wagmi'; 
import NBABetAbi from './../common/NBABet.json';
import { ethers } from 'ethers';
import config from './../common/config.json';

const BetCard = (props) => {
  const chains = useChains();
  const chainId = useChainId();
  const AddressContract = {
    PoV: "0x4c67ad406270451EC63b459428072e5DA611c024",
    NBABet: "0xDAeF5eb7CA101726fc356D4B2a83cE72e5884674"
  }

  const { team1, team2 } = props;

  const submitFormBet = () => {

    if (!props.selectedTeam) {
      alert('Please select a team');
      return;
    }
    if (props.betAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const currentChain = _.find(chains, { id: chainId });
    if (!currentChain) {
      alert('Please connect to a OP or BASE testnet chain.');
      return;
    }
    const submit = () => {
      props.writeContract({
        address: AddressContract.NBABet,
        abi: NBABetAbi,
        functionName: 'placeBet',
        args: [
          Number(props.matchId),
          Number(props.selectedTeam.ID),
          `https://lsm-static-prod.livescore.com/medium/${props.selectedTeam.Img}`,
          ethers.encodeBytes32String(config["sendPacket"][`${currentChain.nativeCurrency.replacedName}`]["channelId"]),
          config["sendPacket"][`${currentChain.nativeCurrency.replacedName}`]["timeout"]
        ],
        value: ethers.parseEther(props.betAmount.toString())
      })
    }
    submit();
  }

  const clickOnRadioInput = (team) => {
    props.setSelectedTeam(team);
  }

  const betAmountChange = (e) => {
    props.setBetAmount(Number(e.target.value));
  }

  return (
    <div className="flex flex-col items-start justify-start border h-80 p-4 mt-20 m-1 w-3/12 space-y-2 bg-white shadow-lg rounded-lg">
      <div className="text-lg font-semibold">Choose a team:</div>
      <div className="flex flex-col items-start space-y-2">
        <div className={`flex flex-col border rounded-md border-slate-600 p-[10px] cursor-pointer ${props.selectedTeam && props.selectedTeam.ID === team1.ID ? 'bg-cyan-400 text-white' : ''}`} onClick={() => { clickOnRadioInput(team1) }}>
          {team1.Nm}
        </div>
        <div className={`flex flex-col border rounded-md border-slate-600 p-[10px] cursor-pointer ${props.selectedTeam && props.selectedTeam.ID === team2.ID ? 'bg-cyan-400 text-white' : ''}`} onClick={() => { clickOnRadioInput(team2) }}>
          {team2.Nm}
        </div>
      </div>
      <label className="text-lg font-semibold">Enter amount of ETH:</label>
      <input value={props.betAmount} step="0.001" type="number" className="border rounded-lg p-2 w-full" onChange={betAmountChange} />
      <button disabled={props.isPending} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed" onClick={submitFormBet}>
        {props.isPending ? 'Confirming' : 'Submit'}
      </button>
    </div>
  );
};

export default BetCard;
