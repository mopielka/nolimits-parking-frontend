import styled from '@emotion/styled'
import type { FC, ReactNode } from 'react'

interface CebulaDealsWrapperProps {
  topThickness?: string
  bottomThickness?: string
  color?: string
  children: ReactNode
}

const Bar = styled.div<{ color?: string; thickness?: string }>`
  position: fixed;
  left: 0;
  right: 0;
  height: ${(props) => props.thickness || '8px'};
  background-color: ${(props) => props.color || 'black'};
`

const TopBar = styled(Bar)`
  top: 0;
`

const BottomBar = styled(Bar)`
  bottom: 0;
`

const Content = styled.div<{ marginTop?: string; marginBottom?: string }>`
  margin-top: ${(props) => props.marginTop || 'auto'};
  margin-bottom: ${(props) => props.marginBottom || 'auto'};
  height: 100%;
`

const CebulaDealsWrapper: FC<CebulaDealsWrapperProps> = ({
  topThickness,
  bottomThickness,
  color,
  children,
}) => {
  return (
    <>
      <TopBar color={color} thickness={topThickness} />
      <Content marginTop={topThickness} marginBottom={bottomThickness}>
        {children}
      </Content>
      <BottomBar color={color} thickness={bottomThickness} />
    </>
  )
}

export default CebulaDealsWrapper
