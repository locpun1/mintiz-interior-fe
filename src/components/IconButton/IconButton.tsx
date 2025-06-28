import React from "react"
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Tooltip, TooltipProps } from "@mui/material"

interface IconButtonProps extends MuiIconButtonProps{
    tooltip?: string,
    tooltipPlacement?: TooltipProps['placement'],
    icon: React.ReactNode,
    width?:string | number,
    height?:string | number,
    border?: string,
    borderRadius?: string | number,
    backgroundColor?: string ,
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    disabled?:boolean,
    handleFunt?: Function,
    children?: React.ReactNode;
    href?: string; // thêm href nếu muốn nhảy link
}

const IconButton: React.FC<IconButtonProps> = ({
    tooltip,
    tooltipPlacement = "bottom",
    icon,
    width = "36px",
    height = "36px",
    border,
    borderRadius,
    backgroundColor,
    color = '',
    disabled,
    handleFunt,
    children,
    href,
    ...props
}) => {
    const handleClick = () => {
        if (handleFunt) handleFunt()
    }
    return(
        <Tooltip title={tooltip} placement={tooltipPlacement} arrow disableFocusListener disableHoverListener>
            <span>
                 {/* span wrapper để Tooltip hoạt động với disabled button */}
                <MuiIconButton
                    {...props}
                    onClick={href ? undefined : handleClick}
                    component={href ? 'a' : 'button'}
                    href={href}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noopener noreferrer' : undefined}
                    sx={{
                        width,
                        height,
                        border,
                        borderRadius,
                        backgroundColor,
                        padding: 0, // ✅ xoá padding mặc định để icon hiển thị đúng kích thước
                        color,
                        '&:hover': {
                            color: 'white',
                            backgroundColor: backgroundColor, // hoặc 'transparent' nếu không muốn nền
                        },
                        '&.Mui-disabled':{
                            backgroundColor:"gray",
                            color: 'white',
                            opacity: 0.5, // hoặc giữ nguyên 1 nếu không muốn bị mờ
                        },
                        ...props.sx
                    }}
                    disabled={disabled}
                >
                    {icon}
                </MuiIconButton>
                {children} 
            </span>
            
        </Tooltip>
    )
}

export default IconButton;