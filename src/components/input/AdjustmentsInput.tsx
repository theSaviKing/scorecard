import { State } from "@/types";
import { Divider, Input, Textarea, Button } from "@nextui-org/react";
import { produce } from "immer";
import { Dispatch, SetStateAction } from "react";
import { PlusCircle, Trash } from "react-feather";

export function AdjustmentsInput({
    state,
    setter,
    homeOrAway,
}: {
    state: State;
    setter: Dispatch<SetStateAction<State>>;
    homeOrAway: boolean;
}) {
    const team = homeOrAway ? state.homeTeam : state.awayTeam;
    return (
        <div className="flex flex-col gap-2 justify-center items-center">
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
            <Divider />
            {team.adjustments.length === 0 ? (
                <div className="w-full py-4 px-8 text-center border-2 border-content2 rounded">
                    No adjustments
                </div>
            ) : (
                team.adjustments.map((adj, index) => (
                    <div
                        className={`flex justify-center items-center gap-4 px-8 py-4 ${
                            homeOrAway
                                ? "bg-primary-100 text-primary-900"
                                : "bg-secondary-100 text-secondary-900"
                        }`}
                    >
                        <p className="text-4xl font-bold font-mono flex justify-center items-center gap-1">
                            +
                            <Input
                                color={homeOrAway ? "primary" : "secondary"}
                                classNames={{
                                    inputWrapper: `${
                                        homeOrAway
                                            ? "border-primary-200 group-hover:border-primary-500"
                                            : "border-secondary-200 group-hover:border-secondary-500"
                                    } px-2 py-0.5`,
                                    input: "text-4xl w-[1ch] text-center font-bold",
                                }}
                                maxLength={1}
                                variant="bordered"
                                radius="none"
                                value={((value) =>
                                    value == null ? "" : String(value))(
                                    adj.value
                                )}
                                onInput={(ev) =>
                                    setter((st) =>
                                        produce(st, (draft) => {
                                            draft[
                                                homeOrAway
                                                    ? "homeTeam"
                                                    : "awayTeam"
                                            ].adjustments[index].value =
                                                parseInt(
                                                    ev.currentTarget.value
                                                );
                                        })
                                    )
                                }
                            />
                        </p>
                        <Divider
                            orientation="vertical"
                            className={
                                homeOrAway ? "bg-primary" : "bg-secondary"
                            }
                        />
                        <Textarea
                            label="Reason"
                            placeholder="Less than two women on opposing team"
                            size="sm"
                            labelPlacement="outside"
                            color={homeOrAway ? "primary" : "secondary"}
                            classNames={{
                                inputWrapper: homeOrAway
                                    ? "border-primary-200 group-hover:border-primary-500"
                                    : "border-secondary-200 group-hover:border-secondary-500",
                                input: homeOrAway
                                    ? "placeholder:text-primary-900/80"
                                    : "placeholder:text-secondary-900/80",
                            }}
                            variant="bordered"
                            value={team.adjustments[index].reason}
                            onValueChange={(value) =>
                                setter((st) =>
                                    produce(st, (draft) => {
                                        draft[
                                            homeOrAway ? "homeTeam" : "awayTeam"
                                        ].adjustments[index].reason = value;
                                    })
                                )
                            }
                            maxRows={2}
                        />
                        <Button
                            isIconOnly
                            className="bg-danger-200 text-danger-700 rounded-sm"
                            onPress={() =>
                                setter((st) =>
                                    produce(st, (draft) => {
                                        draft[
                                            homeOrAway ? "homeTeam" : "awayTeam"
                                        ].adjustments.splice(index, 1);
                                    })
                                )
                            }
                        >
                            <Trash />
                        </Button>
                    </div>
                ))
            )}
            {team.adjustments.length < 3 && (
                <Button
                    isIconOnly
                    radius="full"
                    color={homeOrAway ? "primary" : "secondary"}
                    variant="flat"
                    onPress={() =>
                        setter((st) =>
                            produce(st, (draft) => {
                                draft[
                                    homeOrAway ? "homeTeam" : "awayTeam"
                                ].adjustments.push({
                                    value: 0,
                                    reason: "",
                                });
                            })
                        )
                    }
                >
                    <PlusCircle className="stroke-1" />
                </Button>
            )}
        </div>
    );
}
