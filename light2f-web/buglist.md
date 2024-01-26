### BUGLIST

useBase useListComponent 中跟新数组添加 key 会使得 preData 和 data 值相同，而且跟新后会产生change事件从而触发表单的校验

现在的处理办法是在表单校验的时候来判断一下是不是跟新 key, 但是还是解决不了 preData 和 data 值相同

想法：
后续跟新 key 事件单独使用 onEvent 处理，走另一个通道应该非常合理