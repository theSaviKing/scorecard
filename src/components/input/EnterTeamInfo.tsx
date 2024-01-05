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
import { TeamInput } from "./TeamInput";
import { State } from "../../App";
import { UserPlus } from "react-feather";

export function EnterTeamInfo({
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
                                onPress={() => stepper(2)}
                                endContent={<UserPlus className="w-4" />}
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
