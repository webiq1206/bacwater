import type { ReactNode } from "react";
import styles from "./tools.module.css";
export default function ToolsLayout({children}:{children:ReactNode}){return <div className={styles.workspace}>{children}</div>;}
