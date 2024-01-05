import { State } from "@/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Tooltip,
} from "@nextui-org/react";
import { produce } from "immer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ArrowLeftCircle, FileText, Sliders, Type } from "react-feather";
import { PlayerInput } from "./PlayerInput";

export function EnterPlayerInfo({
    state,
    setter,
    stepper,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    stepper: React.Dispatch<React.SetStateAction<number | null>>;
}) {
    const [method, setMethod] = useState<"input" | "textarea">("input");
    const [homePlayers, setHomePlayers] = useState("");
    const [awayPlayers, setAwayPlayers] = useState("");

    let homePlayerList = homePlayers.split(/\n+/g).filter((s) => s.length > 0);
    let awayPlayerList = awayPlayers.split(/\n+/g).filter((s) => s.length > 0);

    const isDisabled =
        method == "input"
            ? state.homeTeam.players.filter((player) => player.name.length <= 0)
                  .length >= 8 ||
              state.awayTeam.players.filter((player) => player.name.length <= 0)
                  .length >= 8
            : homePlayerList.length < 8 || awayPlayerList.length < 8;

    return (
        <Card>
            <CardHeader>
                <h2 className="font-serif font-bold text-xl text-center">
                    Enter player info
                </h2>
            </CardHeader>
            <Divider />
            <CardBody className="grid grid-cols-2 items-start px-8 gap-4">
                <PlayerInput
                    state={state}
                    homeOrAway={true}
                    setter={setter}
                    method={method}
                    players={homePlayers}
                    setPlayers={setHomePlayers}
                />
                <PlayerInput
                    state={state}
                    homeOrAway={false}
                    setter={setter}
                    method={method}
                    players={awayPlayers}
                    setPlayers={setAwayPlayers}
                />
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between gap-4">
                <Button
                    variant="flat"
                    startContent={<ArrowLeftCircle className="w-4" />}
                    onPress={() =>
                        stepper((step) =>
                            typeof step == "number" ? step - 1 : step
                        )
                    }
                >
                    Back to team info
                </Button>
                <Button
                    variant="flat"
                    startContent={
                        method === "input" ? (
                            <FileText className="w-4" />
                        ) : (
                            <Type className="w-4" />
                        )
                    }
                    onPress={() =>
                        method === "input"
                            ? setMethod("textarea")
                            : setMethod("input")
                    }
                >
                    {method === "input"
                        ? "Switch to pasting text"
                        : "Switch to names input"}
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
                            endContent={<Sliders className="w-4" />}
                            isDisabled={isDisabled}
                            onPress={() => {
                                setter((st) =>
                                    produce(st, (draft) => {
                                        if (method === "input") {
                                            draft.homeTeam.players =
                                                draft.homeTeam.players.filter(
                                                    (p) => p.name.length > 0
                                                );
                                            draft.awayTeam.players =
                                                draft.awayTeam.players.filter(
                                                    (p) => p.name.length > 0
                                                );
                                        } else {
                                            draft.homeTeam.players =
                                                homePlayerList.map(
                                                    (player) => ({
                                                        id: crypto.randomUUID(),
                                                        name: player,
                                                        goalsCaught: 0,
                                                        goalsThrown: 0,
                                                        defensivePlays: 0,
                                                    })
                                                );
                                            draft.awayTeam.players =
                                                awayPlayerList.map(
                                                    (player) => ({
                                                        id: crypto.randomUUID(),
                                                        name: player,
                                                        goalsCaught: 0,
                                                        goalsThrown: 0,
                                                        defensivePlays: 0,
                                                    })
                                                );
                                        }
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
