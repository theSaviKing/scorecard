import { ScrollShadow, Input, Button, Textarea } from "@nextui-org/react";
import { produce } from "immer";
import { State } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { Award } from "react-feather";

export function PlayerInput({
    state,
    setter,
    homeOrAway,
    method,
    players,
    setPlayers,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    homeOrAway: boolean;
    method: "input" | "textarea";
    players: string;
    setPlayers: Dispatch<SetStateAction<string>>;
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
    const team = homeOrAway ? state.homeTeam : state.awayTeam;
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <div
                className={`flex flex-col items-center rounded ${
                    homeOrAway
                        ? "bg-primary-200 text-primary-900"
                        : "bg-secondary-200 text-secondary-900"
                } py-4 px-8 w-full`}
            >
                <p className="uppercase font-bold">
                    {homeOrAway ? "Home" : "Away"} Team
                </p>
                <p className="text-2xl font-thin">{team.name}</p>
            </div>
            {method == "input" ? (
                <ScrollShadow className="grid grid-cols-2 gap-2 justify-items-stretch items-stretch w-96 h-60 overflow-auto">
                    {team.players.map((_, index) => (
                        <div
                            key={index}
                            className={
                                "flex justify-center items-center group" +
                                (index == 0 ? " col-span-full" : "")
                            }
                        >
                            <Input
                                size="sm"
                                variant={index == 0 ? "faded" : "bordered"}
                                color={
                                    index == 0
                                        ? homeOrAway
                                            ? "primary"
                                            : "secondary"
                                        : "default"
                                }
                                value={team.players[index].name}
                                placeholder={
                                    index == 0
                                        ? "Team Captain"
                                        : `Player #${index + 1}`
                                }
                                startContent={
                                    index == 0 ? (
                                        <Award className="w-4 opacity-80" />
                                    ) : (
                                        <></>
                                    )
                                }
                                onValueChange={(pname) => {
                                    setter((st) =>
                                        setName(
                                            st,
                                            index,
                                            homeOrAway
                                                ? "homeTeam"
                                                : "awayTeam",
                                            pname
                                        )
                                    );
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        onPress={() =>
                            setter((st) =>
                                produce(st, (draft) => {
                                    draft[
                                        homeOrAway ? "homeTeam" : "awayTeam"
                                    ].players.push({
                                        id: crypto.randomUUID(),
                                        name: "",
                                        isCaptain: false,
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
            ) : (
                <Textarea
                    variant="faded"
                    placeholder="Enter all player names, separated by a newline, with Captain's name first."
                    value={players}
                    onValueChange={setPlayers}
                    minRows={8}
                    color={homeOrAway ? "primary" : "secondary"}
                    radius="sm"
                ></Textarea>
            )}
        </div>
    );
}
