// Does this count as cheating? It's not reading its own source code, it's getting
// compiled into the binary...
fn main() {
    print!("{}", include_str!("rust.include.rs"));
}
