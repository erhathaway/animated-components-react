import React from 'react';
import styled from 'styled-components';
import Highlight from 'react-highlight.js';

import SceneOne from './scene_one';
import SceneTwo from './scene_two';
import SceneThree from './scene_three';
import SceneFour from './scene_four';
import SceneFive from './scene_five';

const Container = styled.div`
    display: flex;
    font-family: 'Space Mono', monospace;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
    color: Propown;
    max-width: 80%;
    color: rgb(119, 0, 119);
    background-color: lightskyblue;
`;

const HeaderBody = styled.div`
    padding: 40px;
`;

const HeaderSubText = styled.h3`
    color: black;
`;

const CodeBlock = styled(Highlight)`
    margin-top: 40px;
    margin-bottom: 20px;
`;

const Body = styled.div`
    height: calc(100vh - 120px);
    width: calc(100vw - 120px);
    overflow-y: scroll;
    padding: 60px;
`;

// const Messaging = styled.div`
//     border: 1px solid black;
//     border-radius: 7px;
//     padding: 20px;
//     color: white;
//     max-width: 800px;
// `;

const NavMenu = styled.nav`
    display: flex;
    flex-direction: column;
`;

const NavMenuText = styled.div`
    margin-top: 40px;
    margin-bottom: 20px;
    background-color: Lavender;
    width: 190px;
    padding: 5px;
`;
const NavLink = styled.a`
    // display: block;
    font-size: 12px;
    // margin: 5px;
    // width: 100%;
    padding: 7px;
    border-radius: 5px;
    :hover {
        background-color: 46b1f3;
    }
`;

const NavPages = styled.div`
    display: flex;
    flex-direction: column;
`;

const Github = styled.div`
    height: 45px;
    // width: 100%;
    // background-color: Lavender;
    padding: 10px;
    padding-left: 30px;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-size: 10px;
`;

const Scene = styled.div`
    padding-top: 25px;
    margin-bottom: 150px;

    height: 600px;
`;

const SceneTitle = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
`;

const SceneTitleMain = styled.h3`
    margin: 0px;
`;

const SceneTitleSub = styled.h3`
    margin: 0px;

    // margin-left: 10px;
    color: blue;
`;
const SceneDescription = styled.div`
    margin-bottom: 30px;
    font-size: 13px;
`;

const SceneDivider = styled.div`
    margin-bottom: 30px;
    border-bottom: 1px solid black;
`;

const Prop = styled.div`
    margin: 10px;
`;

const Layout = (): JSX.Element => {
    return (
        <Container>
            <Header>
                <HeaderBody>
                    <h1>Animated Components</h1>
                    <HeaderSubText>
                        Animate a single React component or orchestrate animations among a
                        collection of React components.
                    </HeaderSubText>
                    <CodeBlock language={'bash'}>
                        npm install animated-components-react --save
                    </CodeBlock>
                    <NavMenu>
                        <NavMenuText>Jump to an example:</NavMenuText>
                        <NavLink href={'#scene-one'}>Single Component</NavLink>
                        <NavLink href={'#scene-two'}>Parent and child - no orchestration</NavLink>
                        <NavLink href={'#scene-three'}>
                            Parent and child - child waits for parent to enter
                        </NavLink>
                        <NavLink href={'#scene-four'}>
                            Parent and child - parent waits for child to exit
                        </NavLink>
                        <NavLink href={'#scene-five'}>Children of children</NavLink>
                    </NavMenu>
                </HeaderBody>
            </Header>
            <Body>
                <NavPages>
                    <Scene id="scene-one">
                        <SceneTitle>
                            <SceneTitleMain>Single component</SceneTitleMain>
                        </SceneTitle>
                        <SceneDescription>
                            Animate a single component using the `Animate` and `Animatable`
                            components
                        </SceneDescription>
                        <SceneDivider />
                        <SceneOne />
                    </Scene>
                    <Scene id="scene-two">
                        <SceneTitle>
                            <SceneTitleMain>Parent and child:</SceneTitleMain>
                            <SceneTitleSub>with no orchestration binding</SceneTitleSub>
                        </SceneTitle>
                        <SceneDescription>
                            There is no orchestration binding between the two components. This means
                            the parent can leave at any time and the child can enter at any time.
                        </SceneDescription>
                        <SceneDivider />
                        <SceneTwo />
                    </Scene>
                    <Scene id="scene-three">
                        <SceneTitle>
                            <SceneTitleMain>Parent and child:</SceneTitleMain>
                            <SceneTitleSub>child waits for parent to enter</SceneTitleSub>
                        </SceneTitle>
                        <SceneDescription>
                            <b>Uses props: </b>
                            <Prop /> - animationBinding
                            <Prop />- enterAfterParentFinish
                        </SceneDescription>
                        <SceneDivider />
                        <SceneThree />
                    </Scene>
                    <Scene id="scene-four">
                        <SceneTitle>
                            <SceneTitleMain>Parent and child:</SceneTitleMain>
                            <SceneTitleSub>parent waits for child to exit</SceneTitleSub>
                        </SceneTitle>
                        <SceneDescription>
                            <b>Uses props: </b>
                            <Prop /> - animationBinding <Prop />- exitAfterChildFinish
                        </SceneDescription>
                        <SceneDivider />
                        <SceneFour />
                    </Scene>
                    <Scene id="scene-five">
                        <SceneTitle>
                            <SceneTitleMain>Children of children:</SceneTitleMain>
                            <SceneTitleSub>everyone waits for everyone else</SceneTitleSub>
                        </SceneTitle>
                        <SceneDescription>
                            <b>Uses props: </b>
                            <Prop /> - animationBinding <Prop />- exitAfterChildFinish
                            <Prop />- enterAfterParentFinish
                        </SceneDescription>
                        <SceneDivider />
                        <SceneFive />
                    </Scene>
                </NavPages>
            </Body>
        </Container>
    );
};

export default Layout;
