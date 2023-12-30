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
    Tooltip,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import feather from "feather-icons";
import { produce } from "immer";
import { MagicMotion } from "react-magic-motion";

interface State {
    homeTeam: {
        name: string;
        players: {
            id: string;
            name: string;
            goalsCaught: number;
            goalsThrown: number;
            defensivePlays: number;
        }[];
    };
    awayTeam: {
        name: string;
        players: {
            id: string;
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
    const isDisabled = state.homeTeam.name == "" || state.awayTeam.name == "";
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
                    <Tooltip
                        content="Both teams must have a name."
                        color="danger"
                        placement="bottom-end"
                        isDisabled={!isDisabled}
                        isDismissable={false}
                    >
                        <div>
                            <Button
                                onClick={() => {
                                    stepper(2);
                                }}
                                endContent={
                                    <i
                                        data-feather="user-plus"
                                        className="w-4"
                                    ></i>
                                }
                                variant="flat"
                                isDisabled={isDisabled}
                                type="submit"
                            >
                                Enter players
                            </Button>
                        </div>
                    </Tooltip>
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

    const isDisabled =
        state.homeTeam.players.filter((player) => player.name.length <= 0)
            .length >= 8 ||
        state.awayTeam.players.filter((player) => player.name.length <= 0)
            .length >= 8;
    return (
        <Card>
            <CardHeader>
                <h2 className="font-serif font-bold text-xl text-center">
                    Enter player info
                </h2>
            </CardHeader>
            <Divider />
            <CardBody className="grid grid-cols-2 px-8 gap-4">
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-col items-center rounded bg-primary-200 text-primary-900 py-4 px-8 w-full">
                        <p className="uppercase font-bold">Home Team</p>
                        <p className="text-2xl font-thin">
                            {state.homeTeam.name}
                        </p>
                    </div>
                    <MagicMotion>
                        <ScrollShadow className="grid grid-cols-2 gap-2 justify-items-stretch items-stretch w-96 h-60 overflow-auto">
                            {state.homeTeam.players.map((_, index) => (
                                <div
                                    key={index}
                                    className={
                                        "flex justify-center items-center group" +
                                        (index == 0 ? " col-span-full" : "")
                                    }
                                >
                                    <Input
                                        size="sm"
                                        variant={
                                            index == 0 ? "faded" : "bordered"
                                        }
                                        color={
                                            index == 0 ? "secondary" : "default"
                                        }
                                        value={
                                            state.homeTeam.players[index].name
                                        }
                                        placeholder={
                                            index == 0
                                                ? "Team Captain"
                                                : `Player #${index}`
                                        }
                                        startContent={
                                            index == 0 ? (
                                                <i
                                                    data-feather="award"
                                                    className="w-4 opacity-80"
                                                ></i>
                                            ) : (
                                                <></>
                                            )
                                        }
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
                            <Button
                                onClick={() =>
                                    setter((st) =>
                                        produce(st, (draft) => {
                                            draft.homeTeam.players.push({
                                                id: crypto.randomUUID(),
                                                name: "",
                                                goalsCaught: 0,
                                                goalsThrown: 0,
                                                defensivePlays: 0,
                                            });
                                        })
                                    )
                                }
                                size="lg"
                                radius="sm"
                            >
                                +
                            </Button>
                        </ScrollShadow>
                    </MagicMotion>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-col items-center rounded bg-secondary-200 text-secondary-900 py-4 px-8 w-full">
                        <p className="uppercase font-bold">Away Team</p>
                        <p className="text-2xl font-thin">
                            {state.awayTeam.name}
                        </p>
                    </div>
                    <MagicMotion>
                        <ScrollShadow className="grid grid-cols-2 gap-2 justify-items-stretch items-stretch w-96 h-60 overflow-auto">
                            {state.awayTeam.players.map((player, index) => (
                                <div
                                    key={player.id}
                                    className={
                                        "flex justify-center items-center group" +
                                        (index == 0 ? " col-span-full" : "")
                                    }
                                >
                                    <Input
                                        size="sm"
                                        variant={
                                            index == 0 ? "faded" : "bordered"
                                        }
                                        color={
                                            index == 0 ? "secondary" : "default"
                                        }
                                        value={
                                            state.awayTeam.players[index].name
                                        }
                                        placeholder={
                                            index == 0
                                                ? "Team Captain"
                                                : `Player #${index}`
                                        }
                                        startContent={
                                            index == 0 ? (
                                                <i
                                                    data-feather="award"
                                                    className="w-4 opacity-80"
                                                ></i>
                                            ) : (
                                                <></>
                                            )
                                        }
                                        onValueChange={(pname) =>
                                            setter((st) =>
                                                setName(
                                                    st,
                                                    index,
                                                    "awayTeam",
                                                    pname
                                                )
                                            )
                                        }
                                    />
                                </div>
                            ))}
                            <Button
                                onClick={() =>
                                    setter((st) =>
                                        produce(st, (draft) => {
                                            draft.awayTeam.players.push({
                                                id: crypto.randomUUID(),
                                                name: "",
                                                goalsCaught: 0,
                                                goalsThrown: 0,
                                                defensivePlays: 0,
                                            });
                                        })
                                    )
                                }
                                size="lg"
                                radius="sm"
                            >
                                +
                            </Button>
                        </ScrollShadow>
                    </MagicMotion>
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
                <Tooltip
                    content="Each team must have at least 8 players."
                    color="danger"
                    placement="bottom-end"
                    isDismissable={false}
                    isDisabled={!isDisabled}
                >
                    <div>
                        <Button
                            variant="flat"
                            color="success"
                            endContent={
                                <i data-feather="activity" className="w-4"></i>
                            }
                            isDisabled={isDisabled}
                        >
                            Start keeping score
                        </Button>
                    </div>
                </Tooltip>
            </CardFooter>
        </Card>
    );
}

function App() {
    const [state, setState] = useState<State>({
        homeTeam: {
            name: "",
            players: Array(8).fill({
                id: crypto.randomUUID(),
                name: "",
                goalsCaught: 0,
                goalsThrown: 0,
                defensivePlays: 0,
            }),
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
        },
    });
    const [step, setStep] = useState<null | number>(0);

    useEffect(() => {
        feather.replace();
    });

    return (
        <main className="w-full h-full flex flex-col justify-center items-center gap-4">
            {step != null && (
                <header className="flex font-serif">
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
