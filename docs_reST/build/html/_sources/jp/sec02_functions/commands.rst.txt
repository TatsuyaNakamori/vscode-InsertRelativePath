.. _コマンド:

コマンド
#########

.. contents:: このページの目次
   :depth: 2
   :local:


* このエクステンションのコマンドは、Explorerで対象のファイル(CSSや画像ファイル)の項目の上で右クリックし、 ``Insert relative path`` (``相対パスを挿入する``)を選択することで実行することができます。

   * この時、左クリックしてしまうと、ファイルが開いてしまうので注意してください
   * 下図では、 ``default.css`` の上で右クリックしています

   .. figure:: ../../_images/relpath_doc_004.png
      :scale: 80%
      :alt: relpath_doc_004


* Settings(``File> Preferences> Settings``) >  ``Relative Path> Format`` で定義している項目が一つの場合は、コマンドを実行すると直ぐに相対パスが挿入されます

  .. figure:: ../../_gif/relpath_single.gif
     :scale: 75%
     :alt: relpath_single.gif


* 複数定義している場合は、ダイアログが表示されるので、項目を選択します

  .. figure:: ../../_gif/relpath_mult.gif
     :scale: 75%
     :alt: relpath_mult.gif


----------------------------------------------------------------------

.. note::
   もし、何か不具合があった場合は、 `Issues <https://github.com/TatsuyaNakamori/vscode-InsertRelativePath/issues>`_ に報告してください。
   バグなどの報告はこのページからのみ受け付けています。
