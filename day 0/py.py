def func():
    return 1

def call_func(function_param):
    return function_param()

print(call_func(func))
print(call_func(func()))


