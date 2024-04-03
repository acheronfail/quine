from json import dumps as s

print(
    "from json import dumps as s\n\nprint(\n    {0}.format(\n        s({0})\n    )\n)".format(
        s("from json import dumps as s\n\nprint(\n    {0}.format(\n        s({0})\n    )\n)")
    )
)
