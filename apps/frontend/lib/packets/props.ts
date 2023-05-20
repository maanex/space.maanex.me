import { Packet } from "~/../../packages/common/dist"

export function PROPS(_sock: ReturnType<typeof useSocket>, data: Partial<Packet.SC.UserPropsUpdate>) {
  const props = useProps()
  for (const key of Object.keys(data) as (keyof Packet.SC.UserPropsUpdate)[])
    props.value[key] = data[key]!
}
