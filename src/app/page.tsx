"use client"
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";

import opentype, {Font} from "opentype.js";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";

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
        const canvas = canvasRef.current;
        if (!canvas) { return }
        const context = canvas.getContext('2d');
        if (!context) { return }

        canvas.width = 800;
        canvas.height = 400;

        if (!font) { return }
        console.log(font)

        const text = 'Hello, Next.js with opentype.js!';
        const x = 16;
        const y = 200;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFFFFF";


        const path = font.getPath(text, x, y, fontSize);
        path.fill = "#FFFFFF";
        path.draw(context);


        const aboveBaseline = (font.ascender / font.unitsPerEm) * fontSize;
        const belowBaseline = (font.descender / font.unitsPerEm) * fontSize;

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
            <div className={"flex-1 w-full items-center"}>
                <canvas ref={canvasRef} className={"rounded-md border border-input w-[800px] h-[400px] mx-auto mt-8"}/>

                <Input className={"w-[33rem] mt-4 mx-auto"} type={"file"} accept={".otf"} onChange={handleFileChange}/>

                <div className={"flex mt-4 justify-center"}>
                    <div className={"w-64 mr-4"}>
                        <Label>Ascender</Label>
                        <Input type={"number"}
                               value={asc}
                               onChange={(e) => {
                                   setAsc(e.target.value)
                               }}
                        />
                    </div>
                    <div className={"w-64 mb-4"}>
                        <Label>Descender</Label>
                        <Input
                            type={"number"}
                            value={dsc}
                            onChange={(e) => {
                                setDsc(e.target.value)
                            }}
                        />
                    </div>
                </div>

                <div className={"w-[33rem] mb-4 mx-auto"}>
                    <Label>Font size: {fontSize}</Label>
                    <Slider defaultValue={[fontSize]} max={100} step={1}
                            value={[fontSize]}
                            onValueChange={(e) => {
                                setFontSize(e[0])
                            }}
                    />
                </div>

                <div className="flex justify-center">
                    <Button className={"mr-4"} variant={"outline"} onClick={redraw}>Redraw</Button>
                    <Button onClick={save}>Save</Button>
                </div>
            </div>
    );
}
