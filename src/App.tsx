import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import feather from "feather-icons";
import { produce } from "immer";

type State = {
    homeTeam: {
        name: string;
        players: {
            name: string;
            goalsCaught: number;
            goalsThrown: number;
            defensivePlays: number;
        }[];
    };
    awayTeam: {
        name: string;
        players: {
            name: string;
            goalsCaught: number;
            goalsThrown: number;
            defensivePlays: number;
        }[];
    };
};

function EnterTeams({
    state,
    setState,
    step,
    setStep,
}: {
    state: State;
    setState: React.Dispatch<React.SetStateAction<State>>;
    step: 0 | 1 | 2 | 3 | null;
    setStep: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | null>>;
}) {
    const setHTName = (name: string) => {
        setState((state) => ({
            ...state,
            homeTeam: { ...state.homeTeam, name: name },
        }));
    };
    const setATName = (name: string) => {
        setState((state) => ({
            ...state,
            awayTeam: { ...state.awayTeam, name: name },
        }));
    };
    return (
        <form>
            <Card>
                <CardHeader>
                    <h2 className="font-serif font-bold text-xl text-center">
                        Enter team info
                    </h2>
                </CardHeader>
                <Divider />
                <CardBody className="grid grid-cols-2 gap-4">
                    <Input
                        label="Home team"
                        color="primary"
                        variant="faded"
                        isRequired
                        value={state.homeTeam.name}
                        onValueChange={setHTName}
                    />
                    <Input
                        label="Away team"
                        className="text-right"
                        color="secondary"
                        variant="faded"
                        isRequired
                        value={state.awayTeam.name}
                        onValueChange={setATName}
                    />
                </CardBody>
                <Divider />
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={() => setStep(2)}
                        endContent={
                            <i data-feather="user-plus" className="w-4"></i>
                        }
                        variant="faded"
                        isDisabled={
                            state.homeTeam.name == "" ||
                            state.awayTeam.name == ""
                        }
                    >
                        Enter players
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

function App() {
    const [state, setState] = useState<State>({
        homeTeam: { name: "", players: [] },
        awayTeam: { name: "", players: [] },
    });

    useEffect(() => {
        feather.replace();
    });

    const [step, setStep] = useState<null | 0 | 1 | 2 | 3>(0);

    return (
        <main className="w-full h-full flex flex-col justify-center items-center gap-4">
            {step != null && (
                <header className="flex font-serif">
                    <h1 className="text-5xl font-light">ScoreCard</h1>
                </header>
            )}
            {step == 0 && (
                <Button
                    endContent={<i data-feather="activity" className="w-4"></i>}
                    onClick={() => setStep(1)}
                    color="primary"
                    variant="faded"
                >
                    Start scoring
                </Button>
            )}
            {step == 1 && (
                <EnterTeams
                    state={state}
                    setState={setState}
                    step={step}
                    setStep={setStep}
                />
            )}
        </main>
    );
}

export default App;
