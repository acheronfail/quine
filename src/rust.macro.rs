fn main() {
    macro_rules! me { () => ("fn main() {{\n    macro_rules! me {{ () => ({:?}) }}\n    println!(me!(), me!());\n}}") }
    println!(me!(), me!());
}
