# Install desktop deps
npm install --no-save &

# Install app deps
npm install --prefix app --no-save &

# Wait for concurrent installs to finish
wait
