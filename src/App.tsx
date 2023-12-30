import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
    ScrollShadow,
    Spacer,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import feather from "feather-icons";
import { produce } from "immer";

interface State {
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
}

function EnterTeams({
    state,
    setter,
    stepper,
}: {
    state: State;
    setter: Dispatch<SetStateAction<typeof state>>;
    stepper: Dispatch<SetStateAction<number | null>>;
}) {
    const setName = (name: string, team: "homeTeam" | "awayTeam") => {
        setter((state) => ({
            ...state,
            [team]: { ...state[team], name: name },
        }));
    };
    return (
        <form>
            <Card>
                <CardHeader>
                    <h2 className="font-display font-bold text-xl text-center">
                        Enter team info
                    </h2>
                </CardHeader>
                <Divider />
                <CardBody className="grid grid-cols-2 gap-4">
                    <Input
                        label="Home team"
                        color="primary"
                        variant="flat"
                        isRequired
                        value={state.homeTeam.name}
                        onValueChange={(val) => setName(val, "homeTeam")}
                        className="focus:ring-primary/50"
                    />
                    <Input
                        label="Away team"
                        className="text-right focus:ring-secondary/50"
                        color="secondary"
                        variant="flat"
                        isRequired
                        value={state.awayTeam.name}
                        onValueChange={(val) => setName(val, "awayTeam")}
                    />
                </CardBody>
                <Divider />
                <CardFooter className="flex justify-end gap-4">
                    <Button
                        onClick={() => {
                            stepper(2);
                        }}
                        endContent={
                            <i data-feather="user-plus" className="w-4"></i>
                        }
                        variant="flat"
                        isDisabled={
                            state.homeTeam.name == "" ||
                            state.awayTeam.name == ""
                        }
                        type="submit"
                    >
                        Enter players
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}

function EnterPlayers({
    state,
    setter,
    setStep,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    setStep: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const setName = produce(
        (
            draft: State,
            index: number,
            team: "homeTeam" | "awayTeam",
            name: string
        ) => {
            draft[team].players[index].name = name;
        }
    );

    return (
        <Card>
            <CardHeader>
                <h2 className="font-display font-bold text-xl text-center">
                    Enter player info
                </h2>
            </CardHeader>
            <Divider />
            <CardBody className="grid grid-cols-2 px-8 gap-4">
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-col items-center rounded bg-content2 py-4 px-8 w-full">
                        <p className="uppercase font-bold">Home Team</p>
                        <p className="text-2xl font-thin">
                            {state.homeTeam.name}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 w-96">
                        {state.homeTeam.players.map((_, index) => (
                            <div
                                key={index}
                                className="flex justify-center items-center"
                            >
                                <Input
                                    size="sm"
                                    variant="bordered"
                                    value={state.homeTeam.players[index].name}
                                    onValueChange={(pname) =>
                                        setter((st) =>
                                            setName(
                                                st,
                                                index,
                                                "homeTeam",
                                                pname
                                            )
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between gap-4">
                <Button
                    variant="flat"
                    startContent={
                        <i data-feather="arrow-left-circle" className="w-4"></i>
                    }
                    onClick={() =>
                        setStep((step) =>
                            typeof step == "number" ? step - 1 : step
                        )
                    }
                >
                    Back to team info
                </Button>
                <Button
                    variant="flat"
                    color="success"
                    endContent={<i data-feather="activity" className="w-4"></i>}
                >
                    Start keeping score
                </Button>
            </CardFooter>
        </Card>
    );
}

function App() {
    const [state, setState] = useState<State>({
        homeTeam: {
            name: "",
            players: [
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
            ],
        },
        awayTeam: {
            name: "",
            players: [
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
                {
                    name: "",
                    goalsCaught: 0,
                    goalsThrown: 0,
                    defensivePlays: 0,
                },
            ],
        },
    });
    const [step, setStep] = useState<null | number>(0);

    useEffect(() => {
        feather.replace();
    });

    return (
        <main className="w-full h-full flex flex-col justify-center items-center gap-4">
            {step != null && (
                <header className="flex font-display">
                    <h1 className="text-5xl font-light">ScoreCard</h1>
                </header>
            )}
            <p>Track, display, update.</p>
            {step == 0 && (
                <Button
                    endContent={<i data-feather="activity" className="w-4"></i>}
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
                <EnterTeams state={state} setter={setState} stepper={setStep} />
            )}
            {step == 2 && (
                <EnterPlayers
                    state={state}
                    setter={setState}
                    setStep={setStep}
                />
            )}
        </main>
    );
}

export default App;
