forRestFS.js
============

A simple file system traversal

File
====
The traversal returns a simple object without content. The content can be retrieved using a view function (it must be aware of the actual absolute URL).
In the object the full path is not showed for security concerns (this is a front end model that can be retrieved by a client).

    {
        "type": "file",
        "path": "relative/path"
    }


Directory
=========

This is the object format:

    {
        "type": "directory",
        "path": "relative/path"
    }

The directory traversal contains a reference to the fullpath and it can also be used to create new subdirectories and files.

