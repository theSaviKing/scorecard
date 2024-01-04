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
import { AdjustmentsInput } from "./AdjustmentsInput";
import { State } from "../../App";
import { Activity, UserPlus } from "react-feather";

export function EnterPointAdjustments({
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
                    endContent={<UserPlus className="w-4" />}
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
                            endContent={<Activity className="w-4" />}
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
