rm -r build 2>&1 >/dev/null
mkdir -p public
mkdir -p build
mkdir -p build/tmp

cp -r src/functions build/

ls -1 build/functions | while read
do 
    mv node_modules build/functions/$REPLY/ &&
    cd build/functions/$REPLY &&
    zip -rq $REPLY.zip * &&
    cd - &&
    mv build/functions/$REPLY/node_modules . &&
    mv build/functions/$REPLY/$REPLY.zip build/tmp/
done

RETVAL=$? 

if [ $RETVAL -ne 0 ]; then
    exit $RETVAL
fi

rm -r  build/functions/* &&
mv build/tmp/*.zip build/functions/





