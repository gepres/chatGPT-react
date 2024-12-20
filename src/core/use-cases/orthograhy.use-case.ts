export const orthographyUseCase = (prompt: string) => {
  try {

    const resp = await fetch(``)
    
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors:[],
      message: 'No se puedo realizar la consulta'
    }
  }
}