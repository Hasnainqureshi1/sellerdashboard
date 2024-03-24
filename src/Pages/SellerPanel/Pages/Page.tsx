import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { FiEdit2, FiShare2 } from "react-icons/fi";
import { FlexBox } from "@styles";
import PaintTube from "@components/Mixer/PaintTubes/PaintTube";
import { useMixer } from "@contexts/MixerContext";
import Main from "@components/Layout/Main";
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import { ColorMix } from "@contexts/AuthContext/types";

const CardTitle = styled.div`
  font-size: 16px;
  color: #333;
  margin: 4px 0 0;
`;

const CardDate = styled.div`
  font-size: 11px;
  //color: #666;
  margin-bottom: 4px;
`;

const ColorCode = styled.div`
  width: 50%;
  font-size: 20px;
  color: #262c2c;
`;

const IconBar = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  gap: 10px;
`;

const Icon = styled.div`
  cursor: pointer;
`;

const Swatch = styled.img`
  width: 60px;
  border: none;
  outline-color: #ffffff;
  padding: 0;
`;

const PaletteContainer = styled.div`
  //width: 250px;
  min-width: 100%;
  background: #fff;
  border-radius: 24px;
  border: 1px solid #ebebeb;
  //box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 25px;
  box-sizing: border-box;
  height: fit-content;
  @media (max-width: 768px) {
    width: 98vw;
  }
`;

const NewColorButton = styled.button`
  width: 100%;
  background: #5856d6;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 100px;

  font-weight: 400;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    background: #4745c7;
  }
`;

const SwatchesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 22px;
`;

const ColorSwatch = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: ${(props) => props.color};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 3px solid transparent;
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const PaletteSwatch = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.color};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 3px solid transparent;

  &:hover::before,
  &:active::before,
  &.active::before {
    content: "";
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.color};
    box-sizing: border-box;
  }
`;

// Component
const ColorPalette = ({
  handleChangeColor,
  currentMix,
  isPalette,
  handlePaletteToggle,
}: {
  handleChangeColor: (x: ColorMix) => void;
  currentMix: ColorMix | undefined;
  isPalette: boolean;
  handlePaletteToggle: (val: boolean) => void;
}) => {
  // const { gacUser } = useAuth();

  return (
    <PaletteContainer>
      <NewColorButton>New Color</NewColorButton>
      <NewColorButton onClick={() => handlePaletteToggle(!isPalette)}>View Saved {!isPalette ? "Palettes" : "Mixes"} </NewColorButton>
      <CardTitle as="h4" style={{ fontSize: "20px" }}>
        {isPalette ? "Palette" : "Mixes"}
      </CardTitle>

      <SwatchesContainer>
        {gacUser?.mixes &&
          gacUser?.mixes.map((mix) => (
            <PaletteSwatch
              onClick={() => handleChangeColor(mix)}
              className={currentMix?.id === mix.id ? "active" : ""}
              key={mix.id}
              color={mix.hex}
            />
          ))}
      </SwatchesContainer>
    </PaletteContainer>
  );
};

const Colors = () => {
  const colors = [
    "#483838",
    "#35535C",
    "#584C49",
    "#6B2E2E",
    "#9E3636",
    "#A9A931",
    "#483838",
    "#35535C",
    "#584C49",
    "#6B2E2E",
    "#9E3636",
    "#A9A931",
    "#483838",
    "#35535C",
    "#584C49",
    "#6B2E2E",
    "#9E3636",
    "#A9A931",
  ];

  return (
    <FlexBox width="full" direction="column">
      <CardTitle as="h3" style={{ fontSize: "20px" }}>
        Colors
      </CardTitle>
      <SwatchesContainer>
        {colors.map((color) => (
          <ColorSwatch key={color} color={color}>
            {color}
          </ColorSwatch>
        ))}
      </SwatchesContainer>
    </FlexBox>
  );
};
const SavedMixes = () => {
  const { tubes } = useMixer();
  

  const [currentMix, setCurrentMix] = useState<ColorMix | undefined>(undefined);
  const [isPalette, setisPalette] = useState(false);

  // const mix = currentMix ?? (gacUser?.mixes ? gacUser?.mixes[0] : undefined);
  // console.log(mix);
  return (
    <Main>
      <FlexBox flexWrap>
        <FlexBox flex="1 0 20%">
          <ColorPalette
            isPalette={isPalette}
            handlePaletteToggle={setisPalette}
            // currentMix={mix}
            handleChangeColor={(newColor) => setCurrentMix(newColor)}
          />
        </FlexBox>
        <FlexBox direction="column" flex="1 0 79%" padding={1} style={{ border: "1px solid #EBEBEB", borderRadius: "24px" }}>
       
            <FlexBox flexWrap>
              <FlexBox direction="column" flex="1 0 30%" gap={0.4}>
                <CardTitle as="h2" style={{ fontSize: "32px" }}>
                  {mix?.colorName || "Unnamed Acrylic"}
                </CardTitle>
                <CardDate as="p" style={{ fontSize: "18px", color: "#667085" }}>
                  {mix?.date || "7 Feb 2024"}
                </CardDate>
                <ColorCode as="h3">{mix?.hex}</ColorCode>
                <IconBar style={{ justifyContent: "start", marginTop: "10px" }}>
                  <Icon>
                    <FiEdit2 size={16} style={{ color: "#7772FF" }} />
                  </Icon>
                  <Icon>
                    <FiShare2 size={16} style={{ color: "#7772FF" }} />
                  </Icon>
                </IconBar>
              </FlexBox>
              <div>
                <FlexBox padding={1}>
                  {!isPalette && (
                    <FlexBox
                      direction="column"
                      justifyContent="center"
                      gap={1}
                      style={{ flexGrow: 1, gridColumn: "painttubes", gridRow: "body" }}
                    >
                      {["1", "2", "3", "4"].map((id, i: number) => {
                        const tubeNumber = `tube${i + 1}` as "tube1" | "tube2" | "tube3" | "tube4";
                        const selectedTube = tubes[tubeNumber];

                        return <PaintTube key={id} index={i} selectedTube={selectedTube} />;
                      })}
                    </FlexBox>
                  )}
                  <Swatch style={{ backgroundColor: mix.hex, width: "100px" }} src="/images/mixer/swatch-up.svg" alt="swatch.svg" />
                </FlexBox>
              </div>
            </FlexBox>
         
          <Colors />
        </FlexBox>
      </FlexBox>
    </Main>
  );
};

const Page = () => (
  <AuthProvider>
    <SavedMixes />
  </AuthProvider>
);

export default Page;


