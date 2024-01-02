import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
    ScrollShadow,
    Textarea,
    Tooltip,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import feather from "feather-icons";
import { produce } from "immer";
import { useSessionStorage } from "usehooks-ts";
import { TeamInput, PlayerInput, AdjustmentsInput } from "./components";

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
        adjustments: { value: number; reason: string }[];
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
        adjustments: { value: number; reason: string }[];
    };
}
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

function EnterTeamInfo({
    state,
    setter,
    stepper,
}: {
    state: State;
    setter: Dispatch<SetStateAction<typeof state>>;
    stepper: Dispatch<SetStateAction<number | null>>;
}) {
    const setName = (name: string, team: "homeTeam" | "awayTeam") => {
        setter((prevState) => ({
            ...prevState,
            [team]: { ...prevState[team], name: name },
        }));
    };

    const { homeTeam, awayTeam } = state;
    const isDisabled = homeTeam.name === "" || awayTeam.name === "";

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
                    <TeamInput
                        label="Home team"
                        color="primary"
                        variant="flat"
                        value={homeTeam.name}
                        onValueChange={(val) => setName(val, "homeTeam")}
                        className="focus:ring-primary/50"
                    />
                    <TeamInput
                        label="Away team"
                        color="secondary"
                        variant="flat"
                        value={awayTeam.name}
                        onValueChange={(val) => setName(val, "awayTeam")}
                        className="focus:ring-secondary/50"
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
                                onClick={() => stepper(2)}
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

function EnterPlayerInfo({
    state,
    setter,
    stepper,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    stepper: React.Dispatch<React.SetStateAction<number | null>>;
}) {
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
                <PlayerInput state={state} homeOrAway={true} setter={setter} />
                <PlayerInput state={state} homeOrAway={false} setter={setter} />
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between gap-4">
                <Button
                    variant="flat"
                    startContent={
                        <i data-feather="arrow-left-circle" className="w-4"></i>
                    }
                    onClick={() =>
                        stepper((step) =>
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
                            endContent={
                                <i data-feather="sliders" className="w-4"></i>
                            }
                            isDisabled={isDisabled}
                            onClick={() => {
                                setter((st) =>
                                    produce(st, (draft) => {
                                        draft.homeTeam.players =
                                            draft.homeTeam.players.filter(
                                                (p) => p.name.length > 0
                                            );
                                        draft.awayTeam.players =
                                            draft.awayTeam.players.filter(
                                                (p) => p.name.length > 0
                                            );
                                    })
                                );
                                stepper(3);
                            }}
                        >
                            Enter adjustments
                        </Button>
                    </div>
                </Tooltip>
            </CardFooter>
        </Card>
    );
}

function EnterPointAdjustments({
    state,
    setter,
    stepper,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    stepper: Dispatch<SetStateAction<number | null>>;
}) {
    const isValid: boolean =
        state.homeTeam.adjustments.every(
            (adj) => adj.value > 0 && adj.reason.length > 0
        ) &&
        state.awayTeam.adjustments.every(
            (adj) => adj.value > 0 && adj.reason.length > 0
        );
    return (
        <Card>
            <CardHeader>
                <h2 className="font-serif font-bold text-xl text-center">
                    Enter point adjustments
                </h2>
            </CardHeader>
            <Divider />
            <CardBody className="grid grid-cols-2 justify-center items-start px-8 gap-4">
                <AdjustmentsInput
                    homeOrAway={true}
                    setter={setter}
                    state={state}
                />
                <AdjustmentsInput
                    homeOrAway={false}
                    setter={setter}
                    state={state}
                />
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between">
                <Button
                    endContent={
                        <i data-feather="user-plus" className="w-4"></i>
                    }
                    onClick={() => stepper(2)}
                    variant="flat"
                >
                    Back to player info
                </Button>
                <Tooltip
                    color="danger"
                    placement="bottom-end"
                    content="All adjustments must have values."
                    isDisabled={isValid}
                >
                    <div>
                        <Button
                            endContent={
                                <i data-feather="activity" className="w-4"></i>
                            }
                            variant="flat"
                            color="success"
                            isDisabled={!isValid}
                            onClick={() => stepper(null)}
                        >
                            Start keeping score
                        </Button>
                    </div>
                </Tooltip>
            </CardFooter>
        </Card>
    );
}

function ScoreKeeper() {
    return (
        <Card>
            <CardHeader className="text-center">
                <h2 className="font-serif font-bold text-xl text-center">
                    ScoreKeeper
                </h2>
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-col justify-center items-center"></CardBody>
            <Divider />
            <CardFooter></CardFooter>
        </Card>
    );
}

function App() {
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
            {step == null && <ScoreKeeper />}
        </main>
    );
}

export default App;
