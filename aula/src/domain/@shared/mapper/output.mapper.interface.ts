export default interface OutputMapperInterface<I, O> {
    toOutput(output: I[]): O;
}