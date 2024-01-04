import { State } from "@/types";
import { Button, Input } from "@nextui-org/react";
import { BroadcastChannel } from "broadcast-channel";
import { useState } from "react";

function TeamScore({
    team,
    state,
}: {
    team: "homeTeam" | "awayTeam";
    state: State;
}) {
    return (
        <>
            <div
                className={`p-4 uppercase text-center font-bold ${
                    team == "homeTeam"
                        ? "bg-primary-200 text-white/70"
                        : "bg-secondary-200 text-white/70"
                } ${team == "homeTeam" ? "rounded-tl-lg" : "rounded-tr-lg"}`}
            >
                {state[team].name}
            </div>
        </>
    );
}

export function ScoreKeeper({
    bc,
    state,
}: {
    bc: BroadcastChannel;
    state: State;
}) {
    const [message, setMessage] = useState("");
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-serif px-8 py-4 w-full border-2 border-content1 rounded-t-xl text-center">
                ScoreKeeper
            </h2>
            <div className="grid grid-cols-2 gap-4">
                <TeamScore team="homeTeam" state={state} />
                <TeamScore team="awayTeam" state={state} />
            </div>
        </div>
    );
}
