import React, { ReactNode } from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

interface Props {
    readonly title: string
    readonly buttonStyleName?: string
    readonly tooltipStyleName?: string
    readonly onClick?: () => void
}

const IconTooltipButton: React.FC<Props> = (props: Props & {children?: ReactNode}) => {
    const {title, children, buttonStyleName, tooltipStyleName, onClick} = props;
    return (
        <Tooltip title={title} className={tooltipStyleName}>
            <IconButton className={buttonStyleName} onClick={onClick}>
                {children}
            </IconButton>
        </Tooltip>
    )
};

export default IconTooltipButton
