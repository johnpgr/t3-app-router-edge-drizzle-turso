import SyntaxHighlighter from "react-syntax-highlighter"
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Code = ({
    className,
    children,
}: {
    className: string
    children: string
}) => {
    let lang = "text" // default monospaced text
    if (className && className.startsWith("lang-")) {
        lang = className.replace("lang-", "")
    }
    return (
        <SyntaxHighlighter language={lang} style={vs2015}>
            {children}
        </SyntaxHighlighter>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PreBlock = ({ children, ...rest }: { children: any }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ("type" in children && children["type"] === "code") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        return Code(children["props"])
    }
    return <pre {...rest}>{children}</pre>
}

