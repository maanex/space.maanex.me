import { Packet } from "~/../../packages/common/dist"


export const useProps = () => useState<Packet.SC.UserPropsUpdate>('userProps', () => ({
  resources: 0,
  directionOffset: 0
}))
