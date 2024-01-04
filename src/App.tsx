import { Button } from "@nextui-org/react";
import { BroadcastChannel } from "broadcast-channel";
import feather from "feather-icons";
import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import { ScoreKeeper } from "./components";
import {
    EnterPlayerInfo,
    EnterPointAdjustments,
    EnterTeamInfo,
} from "./components/input";
import { Activity } from "react-feather";
import { State } from "./types";

const defaultState: State = {
    homeTeam: {
        name: "",
        players: Array(8).fill({
            id: crypto.randomUUID(),
            name: "",
            goalsCaught: 0,
            goalsThrown: 0,
            defensivePlays: 0,
        }),
        adjustments: [],
    },
    awayTeam: {
        name: "",
        players: Array(8).fill({
            id: crypto.randomUUID(),
            name: "",
            goalsCaught: 0,
            goalsThrown: 0,
            defensivePlays: 0,
        }),
        adjustments: [],
    },
};

function App() {
    const bc = new BroadcastChannel("scoreboard");

    const [state, setState] = useSessionStorage<State>("state", defaultState);
    const [step, setStep] = useState<null | number>(0);

    useEffect(() => {
        feather.replace();
    });

    return (
        <main className="w-full h-full flex flex-col justify-center items-center gap-4">
            {step != null && (
                <header className="space-y-2 text-center font-serif">
                    <h1 className="text-5xl font-light">ScoreCard</h1>
                    <p>Track, display, update.</p>
                </header>
            )}
            {step == 0 && (
                <Button
                    endContent={<Activity className="w-4" />}
                    onClick={() => setStep(1)}
                    color="primary"
                    variant="flat"
                    size="lg"
                    fullWidth
                >
                    Start scoring
                </Button>
            )}
            {step == 1 && (
                <EnterTeamInfo
                    state={state}
                    setter={setState}
                    stepper={setStep}
                />
            )}
            {step == 2 && (
                <EnterPlayerInfo
                    state={state}
                    setter={setState}
                    stepper={setStep}
                />
            )}
            {step == 3 && (
                <EnterPointAdjustments
                    state={state}
                    setter={setState}
                    stepper={setStep}
                />
            )}
            {step == null && <ScoreKeeper bc={bc} state={state} />}
        </main>
    );
}

export default App;
