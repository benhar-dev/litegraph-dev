# Litegraph - GraphFramework Dev Toolset

## Getting started
In order to use this tool you must execute the following two commands
```
git submodule init
git submodule update
```

This will bring both the litegraph and vision-toolkit repos in to this repo. 

## Changing branches on the sub-repo
To work with a different vision-toolkit branch you must use the following commands
```
git config -f .gitmodules submodule.vision-toolkit.branch myBranchName
git submodule update --remote
```
