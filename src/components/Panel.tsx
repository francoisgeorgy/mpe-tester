import React, {FunctionComponent, useState} from "react";

interface PanelProps {
    title?: string,
    closable?: boolean,
    closed?: boolean,
    children: React.ReactNode
}

export const Panel: FunctionComponent<PanelProps> = ({title, closable, closed, children}: PanelProps) => {
    const [panelClosed, setPanelClosed] = useState(!!closed);
    return (
        <div className={closable && panelClosed ? "panel panel-closed" : "panel"}>
            {closable &&
            <div className="panel-title">
                <button className="panel-toggle-button" onClick={() => setPanelClosed(!panelClosed)}>toggle</button> {title}
            </div>}
            <div className="panel-content">
                {children}
            </div>
        </div>
    );
};