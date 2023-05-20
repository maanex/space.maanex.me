

export namespace EntityIds {

  let counter = 0

  export function createNew() {
    return (~~(Date.now() / 1000)) * 1000 + ((counter++) % 1000)
  }

}
