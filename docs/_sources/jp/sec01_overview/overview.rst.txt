概要
####

このツールでは、Explorerで選択したファイルまでの相対パスを挿入します。

相対パスの前後に任意の文字列( `Snippet <https://code.visualstudio.com/docs/editor/userdefinedsnippets>`_  にも対応)を挿入することができます。
例えば、挿入する文字列のフォーマットを ``<link rel="stylesheet" href="{RELPATH}">`` のように定義しておけば、簡単にcssファイルを読み込むための行を挿入できます。



フォーマットは、複数定義することができます。その場合は、どの文字列を挿入するか、ダイアログから選択することになります。

.. figure:: ../../_gif/relpath_mult.gif
   :scale: 100%
   :alt: relpath_mult.gif


.. seealso::
   詳しい内容は、 :doc:`../sec02_functions/index` をご確認ください。


