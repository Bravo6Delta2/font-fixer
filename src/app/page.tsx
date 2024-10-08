"use client"
import {ChangeEvent, useEffect, useRef, useState} from "react";

import opentype, {Font} from "opentype.js";

export default function Home() {

    const [font, setFont] = useState<Font | null>()
    const [fontSize, setFontSize] = useState<number>(48)
    const [asc, setAsc] = useState<string>("0")
    const [dsc, setDsc] = useState<string>("0")
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleFileChange= async (e: ChangeEvent<HTMLInputElement>) =>  {
        const file = e.target.files?.[0]
        if (!file) { return }
        setFont(opentype.parse(await file.arrayBuffer()) as Font)
    }

    const draw = () => {
        if (!font) { return }
        const canvas = canvasRef.current;
        if (!canvas) { return }
        const context = canvas.getContext('2d');
        if (!context) { return }
        const text = 'Hello, Next.js with opentype.js!';

        // Set canvas dimensions
        canvas.width = 800;
        canvas.height = 400;

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set the font size and color
        context.fillStyle = '#EDE9FE';
        context.font = '40px sans-serif'; // Fallback font

        // Positioning
        const x = 50;
        const y = 200;

        console.log(font)
        // Render the text using the loaded font
        const path = font.getPath(text, x, y, fontSize);
        path.draw(context);

        const aboveBaseline = (font.ascender / font.unitsPerEm) * fontSize; // Ascender position
        const belowBaseline = (font.descender / font.unitsPerEm) * fontSize; //


        //base line
        context.strokeStyle = 'white';
        context.beginPath();
        context.moveTo(0, 200);
        context.lineTo(canvas.width, 200);
        context.stroke();

        //ascender line
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(0, 200 - aboveBaseline);
        context.lineTo(canvas.width, 200 - aboveBaseline);
        context.stroke();

        //descender line
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(0, 200 - belowBaseline);
        context.lineTo(canvas.width, 200 - belowBaseline);
        context.stroke();
    }

    const redraw = () => {
        if (!font) { return }
        const iasc= parseInt(asc)
        const idsc= parseInt(dsc)

        font.ascender = iasc;
        font.tables["os2"].sTypoAscender = iasc;
        font.tables["hhea"].ascender = iasc;
        font.descender = idsc;
        font.tables["os2"].sTypoDescender = idsc;
        font.tables["hhea"].descender = idsc;

        draw()
    }

    const save = () => {
        if (!font) { return }
        const href = window.URL.createObjectURL(new Blob([font.toArrayBuffer()]));
        Object.assign(document.createElement('a'), {download: "out.otf", href}).click();
    }

    useEffect(() => {
        if (!font) { return }
        setAsc(font.ascender.toString())
        setDsc(font.descender.toString())
        draw()
    }, [font]);

    useEffect(() => {
        draw()
    }, [fontSize]);

    return (
        <>

            <div>Hello world</div>

            <input type={"file"} accept={".otf"} onChange={handleFileChange}/>

            <canvas ref={canvasRef} className={"border-2 border-violet-100"}/>

            <input
                className={"m-2 text-zinc-950"}
                type={"number"} value={asc}
                onChange={(e) => { setAsc(e.target.value) }}
            />
            <input className={"m-2 text-zinc-950"}
                   type={"number"}
                   value={dsc}
                   onChange={(e) => { setDsc(e.target.value) }}
            />

            <input className={"m-2 text-zinc-950"}
                   type={"number"}
                   value={fontSize}
                   onChange={(e) => { setFontSize(parseInt(e.target.value)) }}
            />

            <button className={"m-2"} onClick={redraw}>Redraw</button>

            <button onClick={save}>Save</button>
        </>
    );
}
