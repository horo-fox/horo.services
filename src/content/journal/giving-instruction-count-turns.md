---
title: "Giving each player a certain length turn in wasmtime"
published: 2-29-2024
summary: "How to make wasmtime yield every so often yet resume"
---

Basically, to make wasmtime yield every _n_ fuel, you will need to use `fuel_async_yield_interval`. Just set it to `Some(whatever)`, make sure your config allows fuel and async support, and you should be good to go. You'll need a baby event loop to just run the task, but something like this will run a program to completion. Simply switch to another after polling and you should be good!:

```rust
fn block_on<F: Future>(future: F) -> F::Output {
    let mut future = std::pin::Pin::from(Box::new(future));
    let waker = futures::task::noop_waker();
    let mut context = std::task::Context::from_waker(&waker);

    loop {
        match future.as_mut().poll(&mut context) {
            std::task::Poll::Ready(out) => break out,
            std::task::Poll::Pending => {}
        }
    }
}
```

There doesn't seem to be any way to change the interval every time a pause happens, judging by past Zulip conversations. Unfortunate, but you can just do an interval every 1 fuel probably. Fuel consumption is already taking some runtime.
