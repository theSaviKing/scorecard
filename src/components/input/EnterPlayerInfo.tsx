import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Tooltip,
} from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { produce } from "immer";
import { PlayerInput } from "./PlayerInput";
import { State } from "../../App";
import { ArrowLeftCircle, Sliders } from "react-feather";

export function EnterPlayerInfo({
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
                    startContent={<ArrowLeftCircle className="w-4" />}
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
                            endContent={<Sliders className="w-4" />}
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
