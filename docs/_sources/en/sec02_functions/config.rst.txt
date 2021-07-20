.. _SettingConfig:

Settings (Config)
##################

.. contents:: Table of contents for this page
   :depth: 2
   :local:



Overview
********

* Settings(``File> Preferences> Settings``) >  ``Relative Path> Format``

  * Here you can set the format of the relative path to be inserted

* If you want to add more formats, click the ``Add Item`` button to add more items.

  * Set the ``Item`` column to whatever name you like (e.g., something that represents the contents of the format).
  * In the ``Value`` column, write the format
  * The first item name is fixed to ``format01``.
  * You will need at least one more item.

  .. figure:: ../../_images/relpath_doc_006.png
     :scale: 100%
     :alt: relpath_doc_006

------------------------------------------------------------

Format
******

Placeholders
==============

* The most concise format is ``{RELPATH}``.

  * The ``{RELPATH}`` part will be filled with the actual relative path string.
  * In the case of ``{RELPATH}``, relative path from ``the directory containing the file`` to ``the target file`` , as used in HTML (e.g. ``css/default.css``).
  * There are more placeholders than ``{RELPATH}``. See :ref:`PlaceholderTypes` for more information.


Path separator
================

* By default, ``/`` is used.

  * If you specify ``{RELPATH}``, the paths are separated by a slash, like ``css/default.css``.

* If you want to change the delimiter, specify one of ``[/]``, ``[\]``, or ``[OS]`` at the beginning of the format.
* For example, ``[\]{RELPATH}`` will set the delimiter to ``\``.

  * ``[/]`` ...Set the delimiter to ``/`` (default)
  * ``[\]`` ...Set the delimiter to ``\``.
  * ``[OS]`` ...The delimiter will change depending on your operating system: ``\`` for Windows, ``/`` for Linux/Mac.


Snippet
================

* You can use the format `Snippet <https://code.visualstudio.com/docs/editor/userdefinedsnippets>`_.
* For example, if you define a format like ``<img src="{RELPATH}" alt="${1:alt}">``, the Snippet will be inserted as shown below (the ``${1:alt}`` part of the format will be selected).

  .. figure:: ../../_images/relpath_doc_007.png
     :scale: 100%
     :alt: relpath_doc_007


------------------------------------------------------------

.. _PlaceholderTypes:

Placeholder types
********************

* The actual relative path will be inserted in the part of the keyword such as ``{RELPATH}``.

+------------------------------+-----------------+-----------------------------------------------------------------------+
| Placeholders                 | Result          | Notes                                                                 |
+==============================+=================+=======================================================================+
| **{RELPATH}**                | img/pic.png     | This is a relative path notation used in HTML.                        |
+------------------------------+-----------------+-----------------------------------------------------------------------+
|| **{RELPATH_ROOT}**          || /img/pic.png   || The path will be relative to Root.                                   |
||                             ||                || The root will be the work folder you have open in VSCode.            |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{RELPATH_CURDIR}**         | ./img/pic.png   | Preceded by ``./`` representing the current directory                 |
+------------------------------+-----------------+-----------------------------------------------------------------------+
|| **{RELPATH_FROMFILE}**      || ../img/pic.png || The path will be relative to the file name. The relative path from   |
||                             ||                || ``/root/index.html`` to ``/root/img/pic.png`` is ``. /img/pic.png``. |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{RELPATH_NOEXT}**          | img/pic         | The result of ``{RELPATH}``, minus the extension.                     |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{RELPATH_ROOT_NOEXT}**     | /img/pic        | The result of ``{RELPATH_ROOT}``, minus the extension.                |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{RELPATH_CURDIR_NOEXT}**   | ./img/pic       | The result of ``{RELPATH_CURDIR}``, minus the extension.              |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{RELPATH_FROMFILE_NOEXT}** | ../img/pic      | The result of ``{RELPATH_FROMFILE}``, minus the extension.            |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{FILENAME}**               | pic.png         | File name only                                                        |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{FILENAME_SEP}**           | /pic.png        | A delimiter will be inserted at the beginning of the file name.       |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{FILENAME_NOEXT}**         | pic             | The result of ``{FILENAME}``, minus the extension.                    |
+------------------------------+-----------------+-----------------------------------------------------------------------+
| **{FILENAME_SEP_NOEXT}**     | /pic            | The result of ``{FILENAME_SEP}``, minus the extension.                |
+------------------------------+-----------------+-----------------------------------------------------------------------+


------------------------------------------------------------

.. note::
   If you have any trouble, please report it to `Issues <https://github.com/TatsuyaNakamori/vscode-InsertRelativePath/issues>`_.
   Bugs and other reports are only accepted from this page.


